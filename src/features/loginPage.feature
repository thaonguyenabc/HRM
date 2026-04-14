Feature: Login Page

    @Login
    Scenario: Login with valid Microsoft account
        Given User goes to landing page
        When I click on login button "Sign in with MS"
        And I enter Microsoft email "thao.nguyen@abcdigital.io"
        And I enter Microsoft password "Thao123456789@@"
        And I handle stay signed in
        Then I should be on "dashboard" page

    @Login
    Scenario: Login with invalid password
        Given User goes to landing page
        When I click on login button "Sign in with MS"
        And I enter Microsoft email "thao.nguyen@abcdigital.io"
        And I enter Microsoft password "wrongpassword"
        Then I should see Microsoft error message