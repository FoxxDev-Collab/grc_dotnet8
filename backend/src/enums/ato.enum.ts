export enum ATOStatus {
    DRAFT = "DRAFT",
    IN_PROGRESS = "IN_PROGRESS",
    UNDER_REVIEW = "UNDER_REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    EXPIRED = "EXPIRED"
}
export enum ATOPhase {
    PREPARATION = "PREPARATION",
    INITIAL_ASSESSMENT = "INITIAL_ASSESSMENT",
    CONTROL_IMPLEMENTATION = "CONTROL_IMPLEMENTATION",
    TESTING = "TESTING",
    VALIDATION = "VALIDATION",
    FINAL_REVIEW = "FINAL_REVIEW",
    AUTHORIZATION = "AUTHORIZATION",
    MONITORING = "MONITORING"
}
export enum DocumentType {
    SSP = "SSP",// System Security Plan
    RAR = "RAR",// Risk Assessment Report
    SAR = "SAR",// Security Assessment Report
    SAP = "SAP",// Security Assessment Plan
    POA_M = "POA_M",// Plan of Action & Milestones
    EVIDENCE = "EVIDENCE",// Control Implementation Evidence
    POLICY = "POLICY",
    PROCEDURE = "PROCEDURE",
    CONFIGURATION = "CONFIGURATION",
    TEST_RESULT = "TEST_RESULT",
    OTHER = "OTHER"
}
export enum ControlStatus {
    NOT_IMPLEMENTED = "NOT_IMPLEMENTED",
    PLANNED = "PLANNED",
    PARTIALLY_IMPLEMENTED = "PARTIALLY_IMPLEMENTED",
    IMPLEMENTED = "IMPLEMENTED",
    NOT_APPLICABLE = "NOT_APPLICABLE"
}
