module.exports = {
    development: {
        url: 'ldap://www.zflexldap.com:389',
        rootDN: "cn=ro_admin,ou=sysadmins,dc=zflexsoftware,dc=com",
        rootPassword: "zflexpass",
        baseDN: "ou=users,ou=guests,dc=zflexsoftware,dc=com"
    },
    test: {
        url: 'ldap://192.168.226.110:389',
        rootDN: "cn=manager,dc=excise,dc=go,dc=th",
        rootPassword: "P@ssw0rd",
        baseDN: "ou=People,dc=excise,dc=go,dc=th"
    },
    test2: {
        url: 'ldap://192.168.191.132:389',
        rootDN: "cn=manager,dc=excise,dc=go,dc=th",
        rootPassword: "P@ssw0rd",
        baseDN: "ou=People,dc=excise,dc=go,dc=th"
    },
    production: {
        url: 'ldap://192.168.163.31:389',
        rootDN: "cn=ldapadm,dc=excise,dc=go,dc=th",
        rootPassword: "P@ssw0rd",
        baseDN: "ou=People,dc=excise,dc=go,dc=th"
    }
}