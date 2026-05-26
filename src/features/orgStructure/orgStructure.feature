@OrgStructure
Feature: Org Structure Page

    @OrgStructure1
    Scenario Outline: Navigate to Org Structure page successfully
        Given User goes to dashboard page
        When User clicks on sidebar menu "<Menu>"
        Then User should see page title "<Title>"
        And User verifies the "<Subtitle>" text is "visible"
        And User verifies the "<Tab>" text is "visible"
        And User verifies the "<SearchField>" field is "visible"

        Examples:
            | Menu          | Title                  | Subtitle                                              | Tab       | SearchField   |
            | Org Structure | Organization Structure | Hierarchy based on primary line manager relationships | Org Chart | Search people |

    @OrgStructure2
    Scenario Outline: Search for an existing person in Org Chart
        Given User goes to dashboard page
        When User clicks on sidebar menu "<Menu>"
        And User searches for "<Name>" in Org Chart
        Then User should see "<Name>" in the Org Chart

        Examples:
            | Menu          | Name         |
            | Org Structure | Khanh Mai    |
            | Org Structure | Quang Nguyen |

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

    @OrgStructure3a
    Scenario Outline: View employee profile for person under collapsed node
        Given User goes to dashboard page
        When User clicks on sidebar menu "Org Structure"
        And User expands "<Parent>" node in the Org Chart
        And User clicks on "<Name>" in the Org Chart
        Then User should see page title "Profile"
        And User should see "<Name>" in profile overview
        And User should see "<Email>" in profile overview
        And User should see "<Role>" in profile overview

        Examples:
            | Parent       | Name     | Email                  | Role     |
            | Quang Nguyen | Linh Dao | linh.dao@abcdigital.io | HR Admin |

    @OrgStructure4
    Scenario Outline: Verify manager-employee hierarchy in Org Chart
        Given User goes to dashboard page
        When User clicks on sidebar menu "Org Structure"
        And User expands "<Manager>" node in the Org Chart
        Then User should see "<Employee>" listed under "<Manager>" in Org Chart

        Examples:
            | Manager      | Employee |
            | Quang Nguyen | Linh Dao |
            | Em Dinh      | Minh Do  |

    @OrgStructure5
    Scenario Outline: Verify role badge displays correctly in Org Chart
        Given User goes to dashboard page
        When User clicks on sidebar menu "Org Structure"
        Then User should see role badge "<Role>" next to "<Name>" in Org Chart

        Examples:
            | Name         | Role     |
            | Khanh Mai    | HR Admin |
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

    @OrgStructure6
    Scenario Outline: Search for a non-existing person in Org Chart
        Given User goes to dashboard page
        When User clicks on sidebar menu "<Menu>"
        And User searches for "<Name>" in Org Chart
        Then Org Chart should show no results

        Examples:
            | Menu          | Name |
            | Org Structure | XYZr |
