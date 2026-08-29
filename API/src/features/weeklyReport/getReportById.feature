@weeklyReport @reportById
Feature: Weekly Report - Get report detail by id

    @positive
    Scenario: Employee retrieves a report detail using an id from the list
        Given I am authenticated on HRM as "employee01"
        When I send "GET" request to "reports"
        Then The response status should be 200
        And I extract from response:
            | variable | path             |
            | reportId | data.data[0].id  |
        Given I set path params:
            | key | value        |
            | id  | {{reportId}} |
        When I send "GET" request to "reportById"
        Then The response status should be 200

    @negative
    Scenario: Getting a non-existent report should return 404
        Given I am authenticated on HRM as "employee01"
        And I set path params:
            | key | value                                |
            | id  | 00000000-0000-0000-0000-000000000000 |
        When I send "GET" request to "reportById"
        Then The response status should be 404