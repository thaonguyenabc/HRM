Feature: Login Page

    @Login
    Scenario: Login with valid Microsoft account
        Given User goes to landing page
        When User clicks on login button "Sign in with MS"
        And User enters Microsoft email
        And User enters Microsoft password
        And User handles stay signed in
        Then User should see the URL contains "dashboard"

    @Login
    Scenario: Login with invalid password
        Given User goes to landing page
        When User clicks on login button "Sign in with MS"
        And User enters Microsoft email
        And User enters Microsoft password "wrongpassword"
        Then User should see Microsoft error message

    @Login
    Scenario: Login with non-existing Microsoft account
        Given User goes to landing page
        When User clicks on login button "Sign in with MS"
        And User enters Microsoft email "abcxyz123@gamil.com"
        Then User should see Microsoft error message
