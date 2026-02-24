// cypress/support/oracle-database.js
const oracledb = require('oracledb');

class OracleDatabase {
  constructor(config = {}) {
    this.config = config;
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = await oracledb.getConnection(this.config);
      console.log('✅ Conectado a Oracle Database');
      return this.connection;
    } catch (error) {
      console.error('❌ Error conectando:', error.message);
      throw error;
    }
  }

  async disconnect() {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
  }

  async execute(sql, binds = [], options = {}) {
    const connection = this.connection || await oracledb.getConnection(this.config);
    const autoClose = !this.connection;

    try {
      const defaultOptions = {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true,
        ...options
      };
      
      const result = await connection.execute(sql, binds, defaultOptions);
      
      return {
        success: true,
        rows: result.rows || [],
        rowsAffected: result.rowsAffected || 0,
        metaData: result.metaData || []
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        errorCode: error.errorNum
      };
    } finally {
      if (autoClose) {
        await connection.close();
      }
    }
  }
}

module.exports = OracleDatabase;