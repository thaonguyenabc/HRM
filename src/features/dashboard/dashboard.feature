@Dashboard
Feature: Dashboard Home Page

    Background:
        Given User goes to dashboard page

    @Dashboard1
    Scenario: Verify dashboard layout and user info
        Then User verifies the "Hi Thao Nguyen!" text is "visible"
        And User verifies the "Here's what's happening at ABC Digital this week." text is "visible"
        And User verifies the "Create new Report" button is "visible"
        And User verifies the "Primary Line Manager" text is "visible"
        And User verifies the "Quang Nguyen" text is "visible"
        And User verifies the "quang.nguyen@abcdigital.io" text is "visible"
        And User verifies the "Thao Nguyen" text is "visible"

    @Dashboard2
    Scenario: Verify dashboard stats display valid data
        Then User verifies the "Reports This Week" stat card shows a valid number
        And User verifies the "Reports This Week" stat card total matches its breakdown
        And User verifies the "Pending Review" stat card shows a valid number
        And User verifies the "Pending Review" stat card total matches its breakdown

    @Dashboard4
    Scenario: Click Reports This Week stat card navigates to weekly reports with this week filter
        When User clicks on the "Reports This Week" section
        Then User should see page title "Weekly Reports"
        And User verifies the "This week" text is "visible"

    @Dashboard5
    Scenario: Click Pending Review stat card navigates to weekly reports with pending review filter
        When User clicks on the "Pending Review" section
        Then User should see page title "Weekly Reports"
        And User verifies the "Pending Review" text is "visible"

    @Dashboard3
    Scenario: Click manager profile then back and open Create new Report modal
        When User clicks on the Primary Line Manager card
        Then User verifies the "Profile Overview" text is "visible"
        When User goes back
        And User clicks on the "Create new Report" button
        Then User verifies the modal is "open"
        And User verifies the "Create Weekly Report" text is "visible"
        When User closes the modal
        Then User verifies the modal is "closed"
