import mongoose from 'mongoose';

const identitySchema = new mongoose.Schema({
  user_email: { type: String, required: true, index: true },
  company_name: { type: String, required: true, index: true },
  category: { type: String, required: true, index: true }, // GB, LB, MB, SME
  account_manager: { type: String, required: true },
  user_type: { type: String, enum: ['internal', 'external'], required: true },
  access_method: { type: String, enum: ['Web', 'Mobile'], required: true }
}, { _id: false });

const actionSchema = new mongoose.Schema({
  module: { type: String, required: true, index: true },
  sub_module: { type: String, required: true, index: true },
  status: { type: String, enum: ['success', 'failed'], required: true },
  latency_ms: { type: Number, required: true }
}, { _id: false });

const dataSnapshotSchema = new mongoose.Schema({
  cr: String,
  service_id: String,
  account_no: String,
  username: String
}, { _id: false });

const logEntrySchema = new mongoose.Schema({
  ts: { type: Date, required: true, index: true },
  identity: identitySchema,
  action: actionSchema,
  data_snapshot: dataSnapshotSchema
}, { timestamps: true });

// Highly optimized compound indexes for the dashboard
logEntrySchema.index({ ts: 1, 'identity.company_name': 1 });
logEntrySchema.index({ ts: 1, 'action.module': 1 });
logEntrySchema.index({ 'identity.user_email': 1, 'identity.company_name': 1 });

const LogEntry = mongoose.model('LogEntry', logEntrySchema);

export default LogEntry;
