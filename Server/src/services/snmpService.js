import snmp from 'net-snmp';

const OIDS = {
  sysUpTime: '1.3.6.1.2.1.1.3.0',
  sysDescr: '1.3.6.1.2.1.1.1.0',
  linux: {
    cpuIdle: '1.3.6.1.4.1.2021.11.11.0',
    memTotalReal: '1.3.6.1.4.1.2021.4.5.0',
    memAvailReal: '1.3.6.1.4.1.2021.4.6.0',
    dskPercent: '1.3.6.1.4.1.2021.9.1.9.1',
  }
};

const createSession = (host, community = 'public') => {
  return snmp.createSession(host, community, {
    port: 161,
    retries: 1,
    timeout: 3000,
    version: snmp.Version2c,
  });
};

const getSingleOid = (session, oid) => {
  return new Promise((resolve, reject) => {
    session.get([oid], (error, varbinds) => {
      if (error) reject(error);
      else if (snmp.isVarbindError(varbinds[0])) reject(new Error(snmp.varbindError(varbinds[0])));
      else resolve(varbinds[0].value);
    });
  });
};

export const getServerMetrics = async (host = '127.0.0.1', community = 'public') => {
  const session = createSession(host, community);
  try {
    const uptime = await getSingleOid(session, OIDS.sysUpTime);
    const cpuIdle = await getSingleOid(session, OIDS.linux.cpuIdle);
    const memTotal = await getSingleOid(session, OIDS.linux.memTotalReal);
    const memAvail = await getSingleOid(session, OIDS.linux.memAvailReal);
    const diskUsage = await getSingleOid(session, OIDS.linux.dskPercent);

    return {
      uptime: Math.floor(uptime / 100), // seconds
      cpuUsage: 100 - parseInt(cpuIdle),
      memoryUsage: Math.round(((memTotal - memAvail) / memTotal) * 100),
      diskUsage: parseInt(diskUsage),
      status: 'online',
      lastUpdate: new Date().toISOString()
    };
  } catch (error) {
    console.error('SNMP Metrics Error:', error.message);
    return { status: 'offline', error: error.message };
  } finally {
    session.close();
  }
};
