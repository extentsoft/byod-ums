
Feature('Login');

Scenario('User signs in', (I) => {
  I.amOnPage('/profile/login');
  I.fillField('username', 'test1');
  I.fillField('password', '123456');
  //I.pressKey('Enter');
  I.click('Sign in');
  I.seeInTitle('Personal Profile');
  I.dontSeeInCurrentUrl('/profile/login');
  //I.seeInSource('<h4 class="text-white cn">thanakorn.piroonsith@excise.go.th [UID @excise.go.th]</h4>');
  //I.see('Personal Profile');
  //I.see('thanakorn.piroonsith@excise.go.th [UID @excise.go.th]', {css: 'h4.text-white.cn'});
  //I.see('test1','.text-white');
});
