#Search.feature

Feature: GitHub testing
    I should be able to log in to GitHub, create a repository and delete it   

    Scenario: Log In to GitHub    
        When I log in using Username as "TestAutomationUser" and Password as "Time4Death!"
        Then there should appear an element containing "testautomationuser" text

    Scenario: Creating a new repository
        When I log in using Username as "testautomationuser" and Password as "Time4Death!"
        And I create a new repository with the name "newrandomreponame" and a Readme
        Then I should be on the "newrandomreponame" repository page of user "testautomationuser"

    Scenario: Deleting a repository
        When I log in using Username as "testautomationuser" and Password as "Time4Death!"
        And I create a new repository with the name "newrandomrepotodelete" and a Readme
        And I click the link with text "Settings"
        And I delete the repo with the name "newrandomrepotodelete"
        Then I should be on the main page
        