@test_case_2.7
@viewing_previous_versions
# ./node_modules/.bin/cypress-tags run -e TAGS='@test_case_2.7'

Feature:  Viewing previous version
  As a user (any role), I want to see any available version so that I can check what was changed.

  Rule: user should be registered.

    Scenario: Create user and upload file with 2 versions
      Given Send request for create user for updating file
      And The user send request for upload file 1 version
#      First version of the file should contain text "Hello, World!"
      And Change file 1 version
      And The user send request for updating file to 2 version
#      Second version of the file should contain text "Good morning!"
      And Send request for list of the previous versions
#      Get list of hash

    Scenario: 1 Viewing previous version
      When The user send request for viewing previous version
#      Previous version should contain text "Hello, World!"
      Then Response status 200 previous version

    Scenario: 2 User can not get previous version with incorrect bearer
      When The user send request for viewing previous version with incorrect bearer
      Then Response status 203 previous version

    Scenario: 3 User can not get previous version bearer is empty
      When The user send request for viewing previous version bearer is empty
      Then Response status 203 previous version

    Scenario: 4 User can not get previous version with incorrect hash
      When The user send request for viewing previous version with incorrect hash
      Then Response status 404 previous version


#    /versions/{hash}:
#    get:

#    parameters:
#    - name: "hash"
#    in: "path"
#    description: "The folder or file name"
#    required: true
#    type: "string"

#    responses:
#    "200":
#    description: "Versions of file"

#    "203":
#    description: "Not Authorized"

#    "404":
#    description: "File with this hash not found"

#    security:
#    - Bearer: []

