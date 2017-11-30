"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DroiConstant = /** @class */ (function () {
    function DroiConstant() {
    }
    // Droi Secure
    DroiConstant.IP_LIST_URL = "http://175.25.22.149:18080/v2/ip_list"; // Production
    // static readonly IP_LIST_URL = "http://10.128.81.202:18080/v2/ip_list"; // Alpha - Nevada
    DroiConstant.VALIDATE_RESOURCE = "/validate";
    DroiConstant.HTTP_HEADER_DROI_ID = "X-Droi-ID";
    DroiConstant.HTTP_HEADER_DROI_STATUS = "X-Droi-Status";
    DroiConstant.HTTP_HEADER_DROI_OTP = "X-Droi-Otp";
    DroiConstant.HTTP_HEADER_DROI_TS = "X-Droi-TS";
    DroiConstant.HTTP_HEADER_DROI_ZC = "X-Droi-ZC";
    DroiConstant.HTTP_HEADER_CONTENT_ENCODING = "Content-Encoding";
    DroiConstant.HTTP_HEADER_REQUEST_ID = "Drid";
    DroiConstant.TIME_DIFF_THRESHOLD = 20 * 60 * 1000;
    DroiConstant.COMMUNICATION_PROTOCOL_VERSION = 2;
    DroiConstant.DROI_STATUS_CORRECT = 1;
    DroiConstant.DROI_STATUS_FAILED = 2;
    DroiConstant.X_DROI_STAT_OK = 0;
    DroiConstant.X_DROI_STAT_KEY_SERVER_NETWORK_ERROR = -1;
    DroiConstant.X_DROI_STAT_ID_SERVER_NETWORK_ERROR = -2;
    DroiConstant.X_DROI_STAT_ILLEGAL_CLIENT_KEY = -3; //*special case: show alert, client is banned
    DroiConstant.X_DROI_STAT_VALIDATE_AGAIN = -4; // mallformed key info
    DroiConstant.X_DROI_STAT_TS_TIMEOUT = -5;
    DroiConstant.X_DROI_STAT_RB_DECRYPT_ERROR = -6;
    DroiConstant.X_DROI_STAT_RB_GUNZIP_ERROR = -7;
    DroiConstant.X_DROI_STAT_RB_TS_VERIFY_ERROR = -8;
    DroiConstant.X_DROI_STAT_GENKEY_VALIDATE_COR_ERROR = -9;
    DroiConstant.X_DROI_STAT_GENKEY_VALIDATE_FAI_ERROR = -10;
    DroiConstant.X_DROI_STAT_BACKEND_NETWORK_ERROR = -11;
    DroiConstant.X_DROI_STAT_KEY_SERVER_ISSUE_REKEY = -12;
    DroiConstant.X_DROI_STAT_SERVER_INTERNAL_ERROR = -13;
    DroiConstant.X_DROI_STAT_RSA_PUBKEY_ERROR = -14; //*special case: MUST update SDK
    DroiConstant.X_DROI_STAT_RB_LZ4_DECOMPRESS_ERROR = -15;
    DroiConstant.X_DROI_STAT_ZONECODE_MISSING = -21;
    DroiConstant.X_DROI_STAT_ZONECODE_EXPIRED = -22;
    DroiConstant.X_DROI_STAT_ZONE_EXPIRED_INVALID = -23;
    DroiConstant.DROI_KEY_JSON_CLASSNAME = "_ClassName";
    DroiConstant.DROI_KEY_JSON_TABLE_NAME = "_TableName";
    DroiConstant.DROI_KEY_JSON_OBJECTID = "_Id";
    DroiConstant.DROI_KEY_JSON_CREATION_TIME = "_CreationTime";
    DroiConstant.DROI_KEY_JSON_MODIFIED_TIME = "_ModifiedTime";
    DroiConstant.DROI_KEY_JSON_DATA_TYPE = "_DataType";
    DroiConstant.DROI_KEY_JSON_FILE_TYPE = "_FileType";
    DroiConstant.DROI_KEY_JSON_KEY = "_DataKey";
    DroiConstant.DROI_KEY_JSON_VALUE = "_DataValue";
    DroiConstant.DROI_KEY_JSON_VALUE_SET = "_ValueSet";
    DroiConstant.DROI_KEY_JSON_BYTE_ARRAY = "_ByteArray";
    DroiConstant.DROI_KEY_JSON_REFERENCE_TYPE = "_ReferenceType";
    DroiConstant.DROI_KEY_JSON_REFERENCE_VALUE = "_Object";
    DroiConstant.DROI_KEY_JSON_REFERENCE_DIRTY_FLAG = "_ReferenceDirtyFlag";
    DroiConstant.DROI_KEY_JSON_PERMISSION = "_ACL";
    DroiConstant.DROI_KEY_JSON_OBJECT_VALUE = "_Value";
    // HTTP
    DroiConstant.DROI_KEY_HTTP_APP_ID = "X-Droi-AppID";
    DroiConstant.DROI_KEY_HTTP_DEVICE_ID = "X-Droi-DeviceID";
    DroiConstant.DROI_KEY_HTTP_API_KEY = "X-Droi-Api-Key";
    DroiConstant.DROI_KEY_HTTP_TOKEN = "X-Droi-Session-Token";
    // USER
    DroiConstant.DROI_API_USER_NOT_EXISTS = 1040009;
    DroiConstant.DROI_API_RECORD_CONFLICT = 1030305;
    DroiConstant.DROI_API_USER_EXISTS = 1040008;
    //
    DroiConstant.DROI_PERMISSION_READ = 2;
    DroiConstant.DROI_PERMISSION_WRITE = 1;
    // DroiQuery
    DroiConstant.DroiQuery_SELECT = "select";
    DroiConstant.DroiQuery_INSERT = "insert";
    DroiConstant.DroiQuery_DELETE = "delete";
    DroiConstant.DroiQuery_UPDATE = "update";
    DroiConstant.DroiQuery_UPDATE_DATA = "updateData";
    DroiConstant.DroiQuery_TABLE_NAME = "tableName";
    DroiConstant.DroiQuery_COUNT = "count";
    DroiConstant.DroiQuery_WHERE = "where";
    DroiConstant.DroiQuery_COND = "cond";
    DroiConstant.DroiQuery_VALUES = "values";
    DroiConstant.DroiQuery_OR = "$or";
    DroiConstant.DroiQuery_AND = "$and";
    DroiConstant.DroiQuery_INC = "inc";
    DroiConstant.DroiQuery_DEC = "dec";
    DroiConstant.DroiQuery_SET = "set";
    DroiConstant.DroiQuery_ATOMIC = "amotic";
    DroiConstant.DroiQuery_ADD = "add";
    DroiConstant.DroiQuery_ORDERBY = "orderby";
    DroiConstant.DroiQuery_ASC = "ASC";
    DroiConstant.DroiQuery_DESC = "DESC";
    DroiConstant.DroiQuery_LIMIT = "limit";
    DroiConstant.DroiQuery_OFFSET = "offset";
    DroiConstant.DroiCondition_LT = "$lt";
    DroiConstant.DroiCondition_LT_OR_EQ = "$lte";
    DroiConstant.DroiCondition_EQ = "$eq";
    DroiConstant.DroiCondition_NEQ = "$ne";
    DroiConstant.DroiCondition_GT_OR_EQ = "$gte";
    DroiConstant.DroiCondition_GT = "$gt";
    DroiConstant.DroiCondition_ISNULL = "$exists";
    DroiConstant.DroiCondition_ISNOTNULL = "ISNOTNULL";
    DroiConstant.DroiCondition_CONTAINS = "$contains";
    DroiConstant.DroiCondition_NOTCONTAINS = "$notContains";
    DroiConstant.DroiCondition_STARTSWITH = "$starts";
    DroiConstant.DroiCondition_NOTSTARTSWITH = "$notStarts";
    DroiConstant.DroiCondition_ENDSWITH = "$ends";
    DroiConstant.DroiCondition_NOTENDSWITH = "$notEnds";
    DroiConstant.DroiCondition_IN = "$in";
    DroiConstant.DroiCondition_NOTIN = "$nin";
    // DroiPermission
    DroiConstant.PERMISSION_READ = 2;
    DroiConstant.PERMISSION_WRITE = 1;
    return DroiConstant;
}());
exports.DroiConstant = DroiConstant;
