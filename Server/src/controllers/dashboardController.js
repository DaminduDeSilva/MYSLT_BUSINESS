import LogEntry from '../models/LogEntry.js';
import { getServerMetrics } from '../services/snmpService.js';

/**
 * Get Server Health Metrics
 */
export const getServerHealth = async (req, res) => {
  try {
    const metrics = await getServerMetrics();
    res.json({ success: true, data: metrics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Dashboard Stats (StatCards)
 */
export const getStatsSummary = async (req, res) => {
  try {
    const { from, to, company } = req.query;
    const query = { ts: { $gte: new Date(from), $lte: new Date(to) } };
    if (company && company !== 'All Companies') query['identity.company_name'] = company;

    const stats = await LogEntry.aggregate([
      { $match: query },
      {
        $facet: {
          totalCompanies: [
            { $group: { _id: "$identity.company_name" } },
            { $count: "count" }
          ],
          externalUsers: [
            { $match: { "identity.user_type": "external" } },
            { $group: { _id: "$identity.user_email" } },
            { $count: "count" }
          ],
          internalUsers: [
            { $match: { "identity.user_type": "internal" } },
            { $group: { _id: "$identity.user_email" } },
            { $count: "count" }
          ]
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        companies: stats[0].totalCompanies[0]?.count || 0,
        external: stats[0].externalUsers[0]?.count || 0,
        internal: stats[0].internalUsers[0]?.count || 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Module Usage (Bar Chart)
 */
export const getModuleUsage = async (req, res) => {
  try {
    const { from, to, company } = req.query;
    const query = { ts: { $gte: new Date(from), $lte: new Date(to) } };
    if (company && company !== 'All Companies') query['identity.company_name'] = company;

    const data = await LogEntry.aggregate([
      { $match: query },
      { $group: { _id: "$action.module", value: { $sum: 1 } } },
      { $project: { name: "$_id", value: 1, _id: 0 } },
      { $sort: { value: -1 } }
    ]);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Leaderboard
 */
export const getLeaderboard = async (req, res) => {
  try {
    const { from, to } = req.query;
    const query = { ts: { $gte: new Date(from), $lte: new Date(to) } };

    const data = await LogEntry.aggregate([
      { $match: query },
      {
        $group: {
          _id: { email: "$identity.user_email", company: "$identity.company_name" },
          hits: { $sum: 1 },
          category: { $first: "$identity.category" },
          am: { $first: "$identity.account_manager" }
        }
      },
      { $sort: { hits: -1 } },
      { $limit: 10 },
      {
        $project: {
          user: "$_id.email",
          company: "$_id.company",
          category: 1,
          am: 1,
          _id: 0
        }
      }
    ]);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Sub Module Usage (Pie Chart)
 */
export const getSubModuleUsage = async (req, res) => {
  try {
    const { from, to, company } = req.query;
    const query = { ts: { $gte: new Date(from), $lte: new Date(to) } };
    if (company && company !== 'All Companies') query['identity.company_name'] = company;

    const data = await LogEntry.aggregate([
      { $match: query },
      { $group: { _id: "$action.sub_module", value: { $sum: 1 } } },
      { $project: { name: "$_id", value: 1, _id: 0 } },
      { $sort: { value: -1 } },
      { $limit: 6 }
    ]);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Category Usage (Horizontal Bar Chart)
 */
export const getCategoryUsage = async (req, res) => {
  try {
    const { from, to, company } = req.query;
    const query = { ts: { $gte: new Date(from), $lte: new Date(to) } };
    if (company && company !== 'All Companies') query['identity.company_name'] = company;

    const data = await LogEntry.aggregate([
      { $match: query },
      { $group: { _id: "$identity.category", value: { $sum: 1 } } },
      { $project: { name: "$_id", value: 1, _id: 0 } },
      { $sort: { value: -1 } }
    ]);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get All Unique Companies
 */
export const getCompaniesList = async (req, res) => {
  try {
    const companies = await LogEntry.distinct('identity.company_name');
    res.json({ success: true, data: companies });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Internal/External Users List
 */
export const getUsersList = (type) => async (req, res) => {
  try {
    const { from, to, company } = req.query;
    const query = { 
      ts: { $gte: new Date(from), $lte: new Date(to) },
      "identity.user_type": type
    };
    if (company && company !== 'All Companies') query['identity.company_name'] = company;

    const users = await LogEntry.distinct('identity.user_email', query);
    res.json({ success: true, data: users.sort() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get Report Data
 */
export const getReportData = async (req, res) => {
  try {
    const { from, to, sub_module, company } = req.query;
    const query = { 
      ts: { $gte: new Date(from), $lte: new Date(to) },
      "action.sub_module": sub_module
    };
    if (company && company !== 'All Companies') query['identity.company_name'] = company;

    const logs = await LogEntry.find(query)
      .limit(1000)
      .sort({ ts: -1 });

    const data = logs.map(log => ({
      cr: log.data_snapshot?.cr || 'N/A',
      company: log.identity.company_name,
      category: log.identity.category,
      serviceId: log.data_snapshot?.service_id || 'N/A',
      accountNo: log.data_snapshot?.account_no || 'N/A',
      am: log.identity.account_manager || 'N/A',
      username: log.data_snapshot?.username || log.identity.user_email,
      ts: log.ts
    }));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
