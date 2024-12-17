export enum ClientRole {
    ADMIN = "ADMIN",// Maps to ISSM - Has full administrative control within client org
    MANAGER = "MANAGER",// Maps to ISSO - Can manage systems but not other users
    PM = "PM",// Program Manager - System security governance
    USER = "USER"
}
