describe('Testing the login page', function() {
    it('should be able to log me in and log me out', function() {
        browser.get("http://192.168.5.165:8081");
        browser.sleep(5000);
        browser.pause;

        //login
        var username = element(by.model('user.username'));
        expect(username.isPresent()).toBe(true);
        username.sendKeys('18980611603');
        var username = element(by.model('user.password'));
        expect(username.isPresent()).toBe(true);
        username.sendKeys('123456');
        var login = element(by.buttonText('登录'));
        expect(login.isPresent()).toBe(true);
        login.click();
        browser.sleep(5000);
        //
        ////购进验收
        //var receiveMenu = element(by.js(function() {
        //  var items = document.querySelectorAll('a');
        //  for (var i = 0; i < items.length; ++i) {
        //      var child = items[i].child();
        //      console.log("================="+child.toString());
        //    //if (child.firstElementChild == '购进验收') {
        //    // console.log(items[i]);
        //    // return items[i];
        //    //}
        //  }
        //}));
        //expect(receiveMenu.isPresent()).toBe(true);
        //
        //
        ////登出
        //browser.sleep(5000);
        //var set = element(by.className('set'));
        //expect(set.isPresent()).toBe(true);
        //set.click();
        //var logout = element(by.xpath('/html/body/ion-nav-view/ion-view[2]/ion-side-menus/ion-side-menu/div[2]/div/a[4]'));
        //expect(logout.isPresent()).toBe(true);
        //logout.click();
    });
});
