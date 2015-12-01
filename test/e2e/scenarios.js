'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('Crossover app test:', function() {
    var ptor = protractor;

    it('should redirect default to report1', function() {
        browser.get('index.html');
        browser.getLocationAbsUrl().then(function(url) {
            expect(url).toEqual('/report1');
        });
    });

    it('should load some records [check by model data]', function() {
         var rowList = element.all(by.repeater('rec in rows'));
         expect(rowList.count()).toBeGreaterThan(0);
    });

    it('should load some records [check by dom rows]', function() {
         var rowList = element.all(by.css('.row'));
         expect(rowList.count()).toBeGreaterThan(0);
    });

    it('click row and check if detail loaded[synchronous]', function() {
         element.all(by.css('.row')).last().click();
         expect(element.all(by.css('.detail')).count()).toBeGreaterThan(0);
    });

    it('click detail and check if detail closed', function() {
         element.all(by.css('.detail')).last().click();
         expect(element.all(by.css('.detail')).count()).toEqual(0);
    });

    it('click row and check if detail loaded[asynchronous]', function() {
         element.all(by.css('.row')).last().click();
         var EC = protractor.ExpectedConditions;
         var e = element(by.css('.detail'));
         browser.wait(EC.presenceOf(e), 10000);
         expect(e.isPresent()).toBeTruthy();
    });

});
