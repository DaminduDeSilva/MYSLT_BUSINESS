import LogEntry from '../models/LogEntry.js';

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
      .limit(100)
      .sort({ ts: -1 });

    const data = logs.map(log => ({
      cr: log.data_snapshot?.cr,
      company: log.identity.company_name,
      category: log.identity.category,
      serviceId: log.data_snapshot?.service_id,
      accountNo: log.data_snapshot?.account_no,
      am: log.identity.account_manager,
      username: log.data_snapshot?.username,
      ts: log.ts
    }));

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
