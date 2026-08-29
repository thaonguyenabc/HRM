@weeklyReport @reportsMe
Feature: Weekly Report - Get my reports

    @positive
    Scenario: Employee successfully retrieves their own report list
        Given I am authenticated on HRM as "employee01"
        When I send "GET" request to "reportsMe"
        Then The response status should be 200
        And response matches schema "reportsMe"
        And The response should contain:
            | key             | value   |
            | message         | Success |

    @negative
    Scenario: Request without token should return 401
        When I send "GET" request to "reportsMe"
        Then The response status should be 401
