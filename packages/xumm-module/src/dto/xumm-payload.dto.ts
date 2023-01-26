import { XummGetPayloadResponse } from "xumm-sdk/dist/src/types";
import {
    XrplTransactionType,
    XummCustomMeta,
    XummJsonTransaction,
    XummPayloadMeta,
    XummTransactionApprovalType,
    XummTransactionType,
} from "xumm-sdk/dist/src/types/xumm-api";

// Object properties are not parsed correctly by openapi as they are not classes and cannot be classes
export class XummPayloadDto implements XummGetPayloadResponse {
    meta: XummPayloadMetaDto;
    application: XummPayloadApplicationDto;
    payload: XummPayloadPayloadDto;
    response: XummPayloadResponseDto;
    custom_meta: XummCustomMeta;
}

class XummPayloadMetaDto implements XummPayloadMeta {
    exists: boolean;
    uuid: string;
    multisign: boolean;
    submit: boolean;
    destination: string;
    resolved_destination: string;
    resolved: boolean;
    signed: boolean;
    cancelled: boolean;
    expired: boolean;
    pushed: boolean;
    app_opened: boolean;
    opened_by_deeplink: boolean | null;
    immutable?: boolean;
    forceAccount?: boolean;
    return_url_app: string | null;
    return_url_web: string | null;
    is_xapp: boolean;
    signers: string[] | null;
}

type XummPayloadApplication = XummGetPayloadResponse["application"];
export class XummPayloadApplicationDto implements XummPayloadApplication {
    name: string;
    description: string;
    disabled: 0 | 1;
    uuidv4: string;
    icon_url: string;
    issued_user_token: string | null;
}

type XummPayloadPayload = XummGetPayloadResponse["payload"];
export class XummPayloadPayloadDto implements XummPayloadPayload {
    tx_type: XummTransactionType | XrplTransactionType;
    tx_destination: string;
    tx_destination_tag: number | null;
    request_json: XummJsonTransaction;
    origintype: string | null;
    signmethod: string | null;
    created_at: string;
    expires_at: string;
    expires_in_seconds: number;
    computed?: Record<string, unknown>;
}

type XummPayloadResponse = XummGetPayloadResponse["response"];
export class XummPayloadResponseDto implements XummPayloadResponse {
    hex: string | null;
    txid: string | null;
    resolved_at: string | null;
    dispatched_nodetype: string | null;
    dispatched_to: string | null;
    dispatched_result: string | null;
    dispatched_to_node: boolean | null;
    environment_nodeuri: string | null;
    environment_nodetype: string | null;
    multisign_account: string | null;
    account: string | null;
    signer: string | null;
    approved_with?: XummTransactionApprovalType;
}