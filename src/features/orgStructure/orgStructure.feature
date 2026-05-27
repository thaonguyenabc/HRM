@OrgStructure
Feature: Org Structure Page

    @OrgStructure1
    Scenario: Navigate to Org Structure page successfully
        Given User goes to dashboard page
        When User clicks on sidebar menu "Org Structure"
        Then User should see page title "Organization Structure"
        And User verifies the "Hierarchy based on primary line manager relationships" text is "visible"
        And User verifies the "Org Chart" text is "visible"
        And User verifies the "Search people" field is "visible"

    @OrgStructure2
    Scenario Outline: Search for an existing person in Org Chart
        Given User goes to dashboard page
        When User clicks on sidebar menu "Org Structure"
        And User searches for "<Name>" in Org Chart
        Then User should see "<Name>" in the Org Chart

        Examples:
            | Name         |
            | Khanh Mai    |
            | Quang Nguyen |

    @OrgStructure3
    Scenario Outline: View employee profile from Org Chart
        Given User goes to dashboard page
        When User clicks on sidebar menu "Org Structure"
        And User clicks on "<Name>" in the Org Chart
        Then User should see page title "Profile"
        And User should see "<Name>" in profile overview
        And User should see "<Email>" in profile overview
        And User should see "<Role>" in profile overview
        When User goes back
        Then User should see page title "Organization Structure"

        Examples:
            | Name         | Email                      | Role     |
            | Quang Nguyen | quang.nguyen@abcdigital.io | HR Admin |

    @OrgStructure4
    Scenario Outline: View employee profile for person under collapsed node
        Given User goes to dashboard page
        When User clicks on sidebar menu "Org Structure"
        And User expands "<Parent>" node in the Org Chart
        And User clicks on "<Name>" in the Org Chart
        Then User should see page title "Profile"
        And User should see "<Name>" in profile overview
        And User should see "<Email>" in profile overview
        And User should see "<Role>" in profile overview
        When User goes back
        Then User should see page title "Organization Structure"

        Examples:
            | Parent       | Name     | Email                  | Role     |
            | Quang Nguyen | Linh Dao | linh.dao@abcdigital.io | Employee |

    @OrgStructure5
    Scenario Outline: Verify manager-employee hierarchy in Org Chart
        Given User goes to dashboard page
        When User clicks on sidebar menu "Org Structure"
        And User expands "<Manager>" node in the Org Chart
        Then User should see "<Employee>" listed under "<Manager>" in Org Chart

        Examples:
            | Manager      | Employee    |
            | Quang Nguyen | Linh Dao    |
            | Em Dinh      | Diem Nguyen |

    @OrgStructure6
    Scenario Outline: Verify role badge displays correctly in Org Chart
        Given User goes to dashboard page
        When User clicks on sidebar menu "Org Structure"
        Then User should see role badge "<Role>" next to "<Name>" in Org Chart

        Examples:
            | Name         | Role     |
            | Khanh Mai    | Employee |
            | Quang Nguyen | HR Admin |

    @OrgStructure7
    Scenario Outline: View hover card details and navigate to profile
        Given User goes to dashboard page
        When User clicks on sidebar menu "Org Structure"
        And User hovers over "<Name>" in the Org Chart
        Then User verifies the "<Department>" text is "visible"
        And User verifies the "<Team>" text is "visible"
        And User verifies the "<Email>" text is "visible"
        When User clicks on the "View Profile" button
        Then User should see page title "Profile"
        When User goes back
        Then User should see page title "Organization Structure"

        Examples:
            | Name      | Department | Team           | Email                   |
            | Khanh Mai | Management | Executive Team | khanh.mai@abcdigital.io |

    @OrgStructure8
    Scenario: Search for a non-existing person in Org Chart
        Given User goes to dashboard page
        When User clicks on sidebar menu "Org Structure"
        And User searches for "XYZ" in Org Chart
        Then Org Chart should show no results
