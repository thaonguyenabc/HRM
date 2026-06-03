@WeeklyReports
Feature: Weekly Reports Page

    Background:
        Given User goes to dashboard page
        When User clicks on sidebar menu "Weekly Reports"

    @WeeklyReports1
    Scenario: Verify list page UI, column headers and report statuses
        Then User should see page title "Weekly Reports"
        And User verifies the "Reports for yourself" text is "visible"
        And User verifies the "Create new Report" button is "visible"
        And User verifies the "All time" text is "visible"
        And User verifies the "All status" text is "visible"
        And User verifies the "Plans Only" text is "visible"
        And User verifies the "Week / Plan" column header is "visible"
        And User verifies the "Status" column header is "visible"
        And User verifies the "Submitted" column header is "visible"
        And User verifies the "Marked as Reviewed by" column header is "visible"
        And User verifies the "Actions" column header is "visible"
        And User verifies the "Showing" text is "visible"

    @WeeklyReports2
    Scenario: Verify Create new Report modal UI elements
        When User clicks on the "Create new Report" button
        Then User verifies the modal is "open"
        And User verifies the "Create Weekly Report" text is "visible"
        And User verifies the "Draft" text is "visible"
        And User verifies the "Select week" text is "visible"
        And User verifies the "To:" text is "visible"
        And User verifies the "CC:" text is "visible"
        And User verifies the "Save as Draft" button is "visible"
        And User verifies the "Submit" button is "visible"
        When User closes the modal
        Then User verifies the modal is "closed"


    @WeeklyReports4
    Scenario: Create a new weekly report and save as draft
        When User clicks on the "Create new Report" button
        Then User verifies the modal is "open"
        When User selects a week for the new report
        And User fills in the weekly report content "AUTOMATION TEST: Weekly report draft"
        And User clicks on the "Save as Draft" button
        Then User verifies the modal is "closed"

    @WeeklyReports5
    Scenario: Create and submit a weekly report then verify in list and detail
        When User clicks on the "Create new Report" button
        Then User verifies the modal is "open"
        When User selects a week for the new report
        And User fills in the weekly report content "AUTOMATION TEST: Weekly report submit"
        And User clicks on the "Submit" button
        Then User verifies the modal is "closed"
        And User verifies the selected week appears in the list
        And User verifies today's date is shown as submit date
        When User opens the first report
        Then User verifies the modal is "open"
        And User verifies the "AUTOMATION TEST: Weekly report submit" text is "visible"
        And User verifies the "Weekly Summary" text is "visible"
        And User verifies the "No comments yet" text is "visible"
        When User closes the modal
        Then User verifies the modal is "closed"

    @WeeklyReports6
    Scenario Outline: Filter reports by status and verify all rows match
        When User clicks on the "All status" section
        And User selects the "<Status>" option from the dropdown
        Then User verifies all visible rows have status "<Status>"

        Examples:
            | Status    |
            | Submitted |
            | Reviewed  |

    @WeeklyReports7
    Scenario: Toggle Plans Only filter and verify list changes
        When User verifies Plans Only filter changes the list
