# MySLT Business Logging Specification (Monitoring System)

The real application must generate logs in **NDJSON** (Newline Delimited JSON) format. Each line must be a valid JSON object representing a single user action or API request.

## Log Entry Schema

```json
{
  "ts": "2026-05-13T14:30:00.000Z",
  "identity": {
    "user_email": "user@leco.lk",
    "company_name": "LECO",
    "category": "GB",
    "account_manager": "Kasun Sameera",
    "user_type": "external",
    "access_method": "Web"
  },
  "action": {
    "module": "Complaints",
    "sub_module": "Bill Complaints",
    "status": "success",
    "latency_ms": 125
  },
  "data_snapshot": {
    "cr": "CR-99210",
    "service_id": "SLT-BUS-001",
    "account_no": "88776655",
    "username": "leco_admin"
  }
}
```

## Field Definitions

| Field | Type | Description | Allowed Values (Examples) |
| :--- | :--- | :--- | :--- |
| `ts` | string | ISO 8601 Timestamp | `2026-05-13T10:00:00.000Z` |
| **identity** | object | Information about the user performing the action | |
| `user_email` | string | The email/ID of the user | `user@domain.lk` |
| `company_name`| string | The organization name | `LECO`, `NWS&DB`, `Pizza Hut` |
| `category` | string | Business segment | `GB`, `LB`, `MB`, `SME` |
| `account_manager`| string | Assigned SLT Staff | `Kasun Sameera` |
| `user_type` | string | Origin of user | `internal`, `external` |
| `access_method` | string | Device/Platform used | `Web`, `Mobile` |
| **action** | object | Details about the operation performed | |
| `module` | string | Primary application feature | `Complaints`, `Service Lineup`, `Billing` |
| `sub_module` | string | Specific page/action | `Bill Complaints`, `Protocol Report` |
| `status` | string | Outcome of the request | `success`, `failed` |
| `latency_ms` | number | Time taken for the request | `125` |
| **data_snapshot**| object | snapshot of the record accessed (Mandatory for Reports) | |
| `cr` | string | Customer Reference Number | `CR-XXXX` |
| `service_id` | string | Unique Service ID | `SID-XXXX` |
| `account_no` | string | Billing Account Number | `ACC-XXXX` |
| `username` | string | Username involved in the record | `user_name_01` |
