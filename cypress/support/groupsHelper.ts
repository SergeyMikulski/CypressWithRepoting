/// <reference types="cypress" />

import * as Collections from 'typescript-collections';

const groupTitleClass = '.Group_title__zVFKn'
const infoButtonClass = '.MuiButton-root'
const infoButtonParent = '.Group_editGroup__Lrae5'
const modalPopUpTitleClass = '.MuiDialogTitle-root'
const createGroupButtonClass = '.ModalManageGroup_createButton__9Um0T'
const activeGroupClass = '[aria-current="page"]'


class GroupsHelper{

    deleteGroupIfExist(groupToFind: string){
        var names = new Collections.Set<String>()
        var namesAfter = new Collections.Set<String>()
        cy.get(groupTitleClass).then(titles =>{
            titles.each((i, title) =>{
                names.add(title.textContent)
            })
        }).then(() =>{
            if(names.contains(groupToFind)){
                cy.deleteGroup(groupToFind).then(() =>{
                    cy.log(`Delete button is pressed for ${groupToFind} group`)

                    cy.get(groupTitleClass).then(titlesAfter =>{
                        titlesAfter.each((i, titleAfter) =>{
                            namesAfter.add(titleAfter.textContent)
                            // console.log(titleAfter.textContent)
                        })
                    }).then(() =>{
                        assert.isFalse(namesAfter.contains(groupToFind), `group ${groupToFind} should be deleted, but it wasn't!`)
                    })
                })
            }
            else{
                cy.log(`There is no ${groupToFind} group. Nothing to delete!`)
            }
        })
    }

    openGroup(groupToFind: string){
        var buttonIndex = 0
        cy.get(groupTitleClass).then(titles =>{
            titles.each((i, title) =>{
                if(title.textContent == groupToFind){
                    buttonIndex = i
                }
            })
        }).then(() =>{
            cy.get(groupTitleClass).eq(buttonIndex).click()
        })
    }

    openManageGroupPopup(groupToFind: string){
        cy.wrap(null, {log:false}).then(() =>{
            this.openGroup(groupToFind)
        }).then(() =>{
            cy.get(activeGroupClass).parent().parent().find(infoButtonParent).invoke('show').trigger('change')
        })
        .then(() =>{
            cy.get(activeGroupClass).parent().parent().find(infoButtonClass).trigger('mouseover').click()
        })
    }

    waitModals(){
        cy.get(modalPopUpTitleClass).should('exist').and('be.visible').then(() =>{
            cy.get(modalPopUpTitleClass).should('not.exist')
        })
    }

    createGroupButtonClick(){
        cy.get(createGroupButtonClass).click()
    }

    verifyGroupPresentOrNot(groupName: string, shouldGroupPresent: boolean){
        var names = new Collections.Set<String>()
        cy.get(groupTitleClass).then(titles =>{
            titles.each((i, title) =>{
                names.add(title.textContent)
            })
        }).then(() =>{
            if(shouldGroupPresent){
                assert.isTrue(names.contains(groupName), `Groups list should contain ${groupName} group, but didn't`)
            }
            else{
                assert.isFalse(names.contains(groupName), `Groups list should NOT contain ${groupName} group, but did`)
            }
        })
    }

    verifyGroupHasImage(groupToFind: string, shouldImagePresent: boolean){
        cy.wrap(null, {log:false}).then(() =>{
            this.openGroup(groupToFind)
        }).then(() =>{
            if(shouldImagePresent){
                cy.get(activeGroupClass).find('img').should('exist')
            }
            else{
                cy.get(activeGroupClass).find('img').should('not.exist')
            }
        })
    }
}

export const groupsHelper = new GroupsHelper()