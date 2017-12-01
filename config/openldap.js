module.exports = {
  development: {
    url: 'ldap://www.zflexldap.com:389',
    rootDN: "cn=ro_admin,ou=sysadmins,dc=zflexsoftware,dc=com",
    rootPassword: "zflexpass",
    baseDN: "ou=users,ou=guests,dc=zflexsoftware,dc=com"
  },
  test: {
    url: 'ldap://192.168.126.110:389',
    rootDN: "cn=ldapadm,dc=excise,dc=go,dc=th",
    rootPassword: "P@ssw0rd",
    baseDN: "ou=People,dc=excise,dc=go,dc=th"
  },
  production: {
    url: 'ldap://192.168.126.110:389',
    rootDN: "cn=ldapadm,dc=excise,dc=go,dc=th",
    rootPassword: "P@ssw0rd",
    baseDN: "ou=People,dc=excise,dc=go,dc=th"
  }
}