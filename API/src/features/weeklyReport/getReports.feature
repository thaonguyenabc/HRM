@weeklyReport @reports
Feature: Weekly Report - List reports

    @positive
    Scenario: Employee retrieves the report list successfully
        Given I am authenticated on HRM as "employee01"
        When I send "GET" request to "reports"
        Then The response status should be 200
        And response matches schema "reportsMe"
        And The response should contain:
            | key     | value   |
            | message | Success |

    @positive @filter
    Scenario: Employee filters reports by a week range
        Given I am authenticated on HRM as "employee01"
        And I build dynamic query params with:
            | key           | value      |
            | page          | 1          |
            | limit         | 10         |
            | weekStartFrom | 2026-01-01 |
            | weekStartTo   | 2026-03-31 |
        When I send "GET" request to "reports"
        Then The response status should be 200
        And response matches schema "reportsMe"

    @positive @filterByStatus
    Scenario: Employee filters reports by submitted status
        Given I am authenticated on HRM as "employee01"
        And I build dynamic query params with:
            | key    | value     |
            | status | submitted |
        When I send "GET" request to "reports"
        Then The response status should be 200

    @negative
    Scenario: Request without token should return 401
        When I send "GET" request to "reports"
        Then The response status should be 401