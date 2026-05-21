@OrgStructure
Feature: Org Structure Page

    @OrgStructure1
    Scenario Outline: Navigate to Org Structure page successfully
        Given User goes to dashboard page
        When User clicks on sidebar menu "<Menu>"
        Then User should see page title "<Title>"

        Examples:
            | Menu          | Title                  |
            | Org Structure | Organization Structure |

    @OrgStructure2
    Scenario Outline: Search for an existing person in Org Chart
        Given User goes to dashboard page
        When User clicks on sidebar menu "<Menu>"
        And User searches for "<Name>" in Org Chart
        Then User should see "<Name>" in the Org Chart

        Examples:
            | Menu          | Name         |
            | Org Structure | Khanh Mai    |
            | Org Structure | Em Dinh      |
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

        Examples:
            | Name         | Email                      | Role     |
            | Quang Nguyen | quang.nguyen@abcdigital.io | Manager  |
            | Linh Dao     | linh.dao@abcdigital.io     | Employee |

    @OrgStructure5
    Scenario Outline: Verify manager-employee hierarchy in Org Chart
        Given User goes to dashboard page
        When User clicks on sidebar menu "Org Structure"
        Then User should see "<Employee>" listed under "<Manager>" in Org Chart

        Examples:
            | Manager      | Employee |
            | Quang Nguyen | Linh Dao |
            | Em Dinh      | Minh Do  |

    @OrgStructure6
    Scenario Outline: Verify role badge displays correctly in Org Chart
        Given User goes to dashboard page
        When User clicks on sidebar menu "Org Structure"
        Then User should see role badge "<Role>" next to "<Name>" in Org Chart

        Examples:
            | Name         | Role     |
            | Khanh Mai    | Manager  |
            | Linh Dao     | Employee |

    @OrgStructure4
    Scenario Outline: Search for a non-existing person in Org Chart
        Given User goes to dashboard page
        When User clicks on sidebar menu "<Menu>"
        And User searches for "<Name>" in Org Chart
        Then Org Chart should show no results

        Examples:
            | Menu          | Name |
            | Org Structure | XYZ  |
