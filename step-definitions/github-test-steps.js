const expect = require('chai').expect;
const webdriver = require("selenium-webdriver");
const until = webdriver.until;

function createDriver() {
  const driver = new webdriver.Builder()
    .usingServer('http://localhost:4444/wd/hub')
    .withCapabilities(webdriver.Capabilities.chrome())
    .build();
  driver.manage().timeouts().implicitlyWait(20000);
  driver.manage().window().maximize();
  return driver;
}

let browser; 

module.exports = function () {

  this.When(/^I log in using Username as "([^"]*)" and Password as "([^"]*)"$/, (login, password) => {

    browser = createDriver(); 

    return browser.get('https://github.com/login').then(() => {
      return browser.findElement(webdriver.By.id('login_field')).sendKeys(login);
    }).then(() => {
      return browser.findElement(webdriver.By.id('password')).sendKeys(password);
    }).then(() => {
      return browser.findElement(webdriver.By.name('commit')).click();
    })
  })

  this.Then(/^there should appear an element containing "([^"]*)" text$/, (keywords) => {
    return browser.wait(until.elementsLocated(webdriver.By.xpath("//strong[contains(text(), " + keywords + ")]")), 10000);
  });

  this.When(/^I click the link with text "([^"]*)"$/, (linkText) => {
    return browser.findElement(webdriver.By.linkText(linkText)).click();
  })

  this.When(/^I create a new repository with the name "([^"]*)" and a Readme$/, { timeout: 40 * 1000 }, (name) => {
    return browser.findElement(webdriver.By.linkText("New repository")).click()
      .then(() => {
        return browser.findElement(webdriver.By.id('repository_name')).sendKeys(name);
      }).then(() => {
        return browser.findElement(webdriver.By.id('repository_auto_init')).click();
      }).then(() => {
        return browser.wait(until.elementLocated(webdriver.By.css('div > button[type="submit"]')), 2000);
      }).then((el) => {
        return el.click();         //browser.executeScript("arguments[0].click()", el);
      })
  })

  this.Then(/^I should be on the "([^"]*)" repository page of user "([^"]*)"$/, (repo, user) => {
    return browser.getTitle().then((title) => {
      return expect(title.toString()).to.be.eql(`${user}/${repo}`);
    })
  })

  this.Then(/^I should be on the main page$/, () => {
    return browser.getCurrentUrl().then((url) => {
      return expect(url).to.be.eql(`https://github.com/`);
    })
  })

  this.When(/^I delete the repo with the name "([^"]*)"$/, (repo) => {
    return browser.findElement(webdriver.By.xpath('//summary[contains(text(), "Delete this repository")]')).click()
      .then(() => {
        return browser.findElement(webdriver.By.css('input[aria-label="Type in the name of the repository to confirm that you want to delete this repository."]'))
        .sendKeys(repo);
      }).then(() => {
        return browser.findElement(webdriver.By.xpath('//button[contains(text(), "I understand the consequences, delete this repository")]')).click();
      })
  })
};