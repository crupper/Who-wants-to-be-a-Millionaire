module.exports = {
    'facebookAuth' : {
        'clientID'      : '1993739860887085', // your App ID
        'clientSecret'  : '0d16f605bf9b370576d52fc7e28a3057', // your App Secret
        'callbackURL'   : 'http://localhost:3000/user/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
    },
    'googleAuth' : {
        'clientID'      : '580370516820-rervr8qcfoln84ueang0co8hmuouvi24.apps.googleusercontent.com',
        'clientSecret'  : 'umtQkG5WN3yfijsXaHfct5UL',
        'callbackURL'   : 'http://localhost:3000/user/auth/google/callback'
    }
}