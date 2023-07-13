/// <reference types="cypress" />

import{loginHelper} from '../support/loginHelper'
import{groupsHelper} from '../support/groupsHelper'
import { manageGroupHelper } from '../support/manageGroupHelper'

const groupsTestsSessionName = 'groupsTestsSession'

const groupName = 'ABC123'
const newGroupName = 'BCDE321'

before(() =>{
    Cypress.session.clearAllSavedSessions()
})

beforeEach(() =>{
    cy.session(groupsTestsSessionName, () =>{
        loginHelper.initialLogin()
    })
    cy.on('uncaught:exception', (err, runnable) => {
        return false
    })
    cy.visit('/')
    cy.intercept('GET', '/api/groups/').as('requestGetGroups')
    cy.wait('@requestGetGroups', {timeout : 10000})
})

describe('Add/Delete Group tests', () => {
    it('Group can be created', () => {
        groupsHelper.deleteGroupIfExist(groupName)
        groupsHelper.createGroupButtonClick()
        manageGroupHelper.createOrRenameGroup(groupName)

        var shouldGroupPresent = true
        groupsHelper.verifyGroupPresentOrNot(groupName, shouldGroupPresent)
    })

    it('Group cannot be doubled and name should have correct symbols', () => {
        var messageOnGroupDuplication = 'The name already exists'
        var messageOnGroupIncorrectName = 'Name must contain EN letters, numbers, spaces only'
        var incorrectGroupName1 = '1wer'
        var incorrectGroupName2 = 'абв'
        var incorrectGroupName3 = 'ABC!'
        
        groupsHelper.createGroupButtonClick()
        manageGroupHelper.verifyErrorInNameFieldWithInactiveCreateButton(groupName, messageOnGroupDuplication)
        manageGroupHelper.verifyErrorInNameFieldWithInactiveCreateButton(incorrectGroupName1, messageOnGroupIncorrectName)
        manageGroupHelper.verifyErrorInNameFieldWithInactiveCreateButton(incorrectGroupName2, messageOnGroupIncorrectName)
        manageGroupHelper.verifyErrorInNameFieldWithInactiveCreateButton(incorrectGroupName3, messageOnGroupIncorrectName)
    })

    it('Group can be deleted', () =>{
        groupsHelper.deleteGroupIfExist(groupName)
    })
})

describe('Edit Group settings', () =>{
    it('Rename Group', () =>{
        groupsHelper.deleteGroupIfExist(groupName)
        groupsHelper.deleteGroupIfExist(newGroupName)
        groupsHelper.createGroupButtonClick()
        manageGroupHelper.createOrRenameGroup(groupName)
        groupsHelper.openManageGroupPopup(groupName)
        manageGroupHelper.createOrRenameGroup(newGroupName)
        
        var shouldGroupPresent = false
        groupsHelper.verifyGroupPresentOrNot(groupName, shouldGroupPresent)
        
        var shouldGroupPresent = true
        groupsHelper.verifyGroupPresentOrNot(newGroupName, shouldGroupPresent)
    })

    it('Image no more than 128 kb can be added to Group', () =>{
        var shouldImagePresent = false
        groupsHelper.verifyGroupHasImage(newGroupName, shouldImagePresent)
        groupsHelper.openManageGroupPopup(newGroupName)
        manageGroupHelper.verifyGroupHasImage(shouldImagePresent)
        manageGroupHelper.verifyTooBigImagesCannotBeUploaded()
        manageGroupHelper.addCorrectImageAndSave()

        shouldImagePresent = true
        groupsHelper.verifyGroupHasImage(newGroupName, shouldImagePresent)
    })

    it('Image can be deleted from Group', () =>{
        var shouldImagePresent = true
        groupsHelper.verifyGroupHasImage(newGroupName, shouldImagePresent)
        groupsHelper.openManageGroupPopup(newGroupName)
        manageGroupHelper.verifyGroupHasImage(shouldImagePresent)
        manageGroupHelper.deleteImageAndSave()

        shouldImagePresent = false
        groupsHelper.verifyGroupHasImage(newGroupName, shouldImagePresent)
        
    })
})

describe('Add Delete employee as Group Editor', () =>{
    it('Add Employee as Editor', () =>{
        var employeeKeyword = 'mik'
        var employeeChosenAsEditor = ''

        groupsHelper.deleteGroupIfExist(groupName)
        groupsHelper.createGroupButtonClick()
        manageGroupHelper.createOrRenameGroup(groupName)
        groupsHelper.openManageGroupPopup(groupName)
        manageGroupHelper.verifyEditorsSearchReturnEmployeeWithAvatar(employeeKeyword)
        manageGroupHelper.chooseEmployeeAsEditor(employeeKeyword)
        cy.get('@employeeChosenAlias').then(employeePreviouslyChosen=>{
            //cy.log(employeePreviouslyChosen.toString(), '=employeePreviouslyChosen2')
            groupsHelper.openManageGroupPopup(groupName)
            employeeChosenAsEditor = employeePreviouslyChosen.toString()
            // cy.log(employeeChosenAsEditor, '=employeeChosenAsEditor')
            // cy.log(employeePreviouslyChosen.toString(), '=employeePreviouslyChosen3')
            manageGroupHelper.verifyCorrectEmployeeIsSetAsEditor(employeeChosenAsEditor)
        })
    })

    it('Employee cannot be chosen as Editor Twice', () =>{
        groupsHelper.openManageGroupPopup(groupName)
        manageGroupHelper.verifyEmployeeCannotBeChosenAsEditorTwice()
    })

    it('Employee can be deleted from Editors list', () =>{
        groupsHelper.openManageGroupPopup(groupName)
        manageGroupHelper.deleteGroupEditor()
        groupsHelper.openManageGroupPopup(groupName)
        manageGroupHelper.verifyGroupHasNoEditors()

    })
})