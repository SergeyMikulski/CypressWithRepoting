/// <reference types="cypress" />

const nameFieldId = '#outlined-error'
const deleteButtonClass = '.ModalManageGroup_removeButton__aTxKm'
const createButtonActiveClass = '.ModalManageGroup_button_primary__bA-5D'
const nameFieldErrorClass = '.MuiFormHelperText-filled'
const groupImageClass = '.ImageUpload_clientImage__5hzgg'
const imageValidationMessageActiveClass = '.ImageUpload_validationMessage__Sd-WY'
const fileUploadFieldPath = 'input[type=file]'
const removeImageClass = '.ImageUpload_removeImage__DcIfE'
const addEmployeeButtonClass = '.ModalManageGroup_editorImage__3uMyJ'
const addEmployeeFieldClass = '.MuiInputBase-inputAdornedStart'
const employeeListOptionsPath = '.MuiAutocomplete-listbox li'
const employeeListOptionsPicturesPath = `${employeeListOptionsPath} img`
const employeeSetAsEditorNameClass = '.MuiListItemText-primary'
const employeeDeleteFronEditorsButtonClass = '.MuiIconButton-edgeEnd'
const deleteAlertYesButtonClass = '.ModalConfirm_button_warning__pAxjC'
const canselButtonClass = '.ModalManageGroup_button_secondary__z2Thq'

class ManageGroupHelper{
    pressDeleteButton(){
        cy.intercept('DELETE', '/api/groups/*').as('requestDeleteGroups')
        cy.get(deleteButtonClass).click()
        cy.wait('@requestDeleteGroups', {timeout : 10000})
    }

    createOrRenameGroup(groupName: string){
        cy.get(nameFieldId).clear().type(groupName).then(() =>{
            this.pressSaveButton()
        })
    }

    verifyErrorInNameFieldWithInactiveCreateButton(incorrectGroupName: string, errorStringExpected: string){
        cy.get(nameFieldId).clear().type(incorrectGroupName)
        cy.get(nameFieldErrorClass).should('be.visible').and('contain.text', errorStringExpected)
        cy.get(createButtonActiveClass).should('not.exist')
    }

    pressSaveButton(){
        cy.intercept('/api/groups/').as('requestGroups')
        cy.get(createButtonActiveClass).click()
        cy.wait('@requestGroups', {timeout : 10000})
    }

    verifyGroupHasImage(shouldGroupHasImage: boolean){
        if(shouldGroupHasImage){
            cy.get(groupImageClass).should('exist')
        }
        else{
            cy.get(groupImageClass).should('not.exist')
        }
    }

    verifyTooBigImagesCannotBeUploaded(){
        cy.get(fileUploadFieldPath).selectFile('cypress/fixtures/Apples_380kb.png', {force: true})
        cy.get(imageValidationMessageActiveClass).should('exist')
        cy.get(createButtonActiveClass).should('not.exist')

        cy.get(removeImageClass).click()
    }

    addCorrectImageAndSave(){
        cy.get(fileUploadFieldPath).selectFile('cypress/fixtures/Apples_75kb.jpg', {force: true})
        cy.get(imageValidationMessageActiveClass).should('not.exist')
        cy.get(createButtonActiveClass).should('exist').then(() =>{
            var shouldGroupHasImage = true
            this.verifyGroupHasImage(shouldGroupHasImage)
        }).then(() =>{
            this.pressSaveButton()
        })
    }

    deleteImageAndSave(){
        cy.get(removeImageClass).click().then(() =>{
            var shouldGroupHasImage = false
            this.verifyGroupHasImage(shouldGroupHasImage)
        }).then(() =>{
            this.pressSaveButton()
        })
    }

    verifyEditorsSearchReturnEmployeeWithAvatar(searchKeyword: string){
        cy.get(addEmployeeButtonClass).click()
        cy.get(addEmployeeFieldClass).clear().type(searchKeyword)
        cy.get(employeeListOptionsPath).should('have.length.above', 0)
        cy.get(employeeListOptionsPicturesPath).should('have.length.above', 0)
        cy.get(employeeListOptionsPath).each(element =>{
            assert.isNotEmpty(element.text().trim(), 'all found employees should have Name, but this is empty')
        })
    }

    chooseEmployeeAsEditor(searchKeyword: string){
        cy.get(addEmployeeButtonClass).click()
        cy.get(addEmployeeFieldClass).clear().type(searchKeyword)
        cy.get(employeeListOptionsPath).eq(0).then(employee =>{
            var employeeChosen = employee.text().trim()
            //cy.log(employeeChosen, '=employeeChosen')
            cy.wrap(employeeChosen).as('employeeChosenAlias')
            employee.trigger('click')
        })
        cy.get(createButtonActiveClass).click()
    }

    verifyCorrectEmployeeIsSetAsEditor(employeeChosen: string){
        cy.get(employeeSetAsEditorNameClass).then(employeeCurrent =>{
            var employeeCurrentTrim = employeeCurrent.text().trim()
            assert.isTrue(employeeChosen == employeeCurrentTrim, `${employeeChosen} previously chosen Employee as Editor should persist, but there is ${employeeCurrentTrim} on page`)
        })
    }

    verifyEmployeeCannotBeChosenAsEditorTwice(){
        cy.get(employeeSetAsEditorNameClass).then(employeeCurrent =>{
            var employeeCurrentTrim = employeeCurrent.text().trim()
            cy.get(addEmployeeButtonClass).click()
            cy.get(addEmployeeFieldClass).clear().type(employeeCurrentTrim)
            cy.get(employeeListOptionsPath).should('not.exist')
        })
    }

    deleteGroupEditor(){
        cy.get(employeeDeleteFronEditorsButtonClass).click()
        cy.get(deleteAlertYesButtonClass).click()
        this.verifyGroupHasNoEditors()
        cy.get(canselButtonClass).click()
    }

    verifyGroupHasNoEditors(){
        cy.get(employeeSetAsEditorNameClass).should('not.exist')
    }
}

export const manageGroupHelper = new ManageGroupHelper()