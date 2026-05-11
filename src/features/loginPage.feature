Feature: Login Page

    @Login
    Scenario: Login with valid Microsoft account
        Given User goes to landing page
        When I click on login button "Sign in with MS"
        And I enter Microsoft email
        And I enter Microsoft password
        And I handle stay signed in
        Then I should be on "dashboard" page

    @Login
    Scenario: Login with invalid password
        Given User goes to landing page
        When I click on login button "Sign in with MS"
        And I enter Microsoft email
        And I enter Microsoft password "wrongpassword"
        Then I should see Microsoft error message

    @Login
    Scenario: Login with non-existing Microsoft account
        Given User goes to landing page
        When I click on login button "Sign in with MS"
        And I enter Microsoft email "abcxyz123@gamil.com"
        Then I should see Microsoft error message
# @Login1
# Scenario Outline: Login with Microsoft account
#     Given User goes to landing page
#     When I click on login button "Sign in with MS"
#     And I enter Microsoft email "<email>"
#     And I enter Microsoft password "<password>"
#     Then <outcome>

#     Examples:
#         | email                     | password        | outcome                              |
#         | thao.nguyen@abcdigital.io | Thao123456789@@ | I should be on "dashboard" page      |
#         | thao.nguyen@abcdigital.io | wrongpassword   | I should see Microsoft error message |
#         | ngthaok55@gmail.com       | anypassword     | I should see Microsoft error message |