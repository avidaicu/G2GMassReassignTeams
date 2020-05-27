({
    doCancel : function(component, event, helper){
        $A.get("e.force:closeQuickAction").fire();
    },
    fetchAgents : function(component, event, helper){
        console.log(component.get("v.acc.TM_SubRegion__c"));
        // if(component.get("v.acc.TM_SubRegion__c") != "")
        //     alert('Please input the Region');
        helper.findAccounts(component, event, helper);
        // else
        //  alert('Please input the Region');
    },
    UpdateSelectedRows : function(component, event, helper) {
        var selectedRows = event.getParam('selectedRows');        
        var setRows = [];
        for (var i = 0; i < selectedRows.length; i++){
            setRows.push(selectedRows[i].Id);
        }//selectedRows
        console.log(setRows);
        var allSelectedRows = component.get("v.selection");
        console.log(allSelectedRows);
    },
    
    //handle Picklist Selection-
    handleChange : function(component, event, helper) {
	
        var selectedMemberVal = component.find('selectMember').get('v.value');
        var selectedCentre = component.find('selectCenter');
        	
        component.set('v.selectedMember', selectedMemberVal);
        component.set('v.centerValue', (selectedMemberVal == 'Centre Specialist' && selectedCentre) ? selectedCentre.get('v.value')  : 'Select Centre');
        
    },
    
    loadOptions: function (component, event, helper) {
        helper.findTeamMemberRoles(component, event, helper);
        helper.fetchCenterNames(component, event, helper);
        helper.getProductNames(component, event, helper);
    },
    
    updateColumnSorting: function (cmp, event, helper) {     
        var fieldName = event.getParam('fieldName');
        console.log('fieldName='+fieldName);
        var sortDirection = event.getParam('sortDirection');
        // assign the latest attribute with the sorted column fieldName and sorted direction
        cmp.set("v.sortedBy", fieldName);
        cmp.set("v.sortedDirection", sortDirection);
        helper.sortData(cmp, fieldName, sortDirection);
    },
    getPageOpps: function (component, event, helper) {
        console.log('getOpps'); console.log(component.get('v.selectedRows'));
        
        component.set('v.isSending',true);
        var pageNumber = event.getSource().get("v.value");
        helper.pageOpp(component, pageNumber);
        component.set('v.isSending',false);
  
    },
    submitSelectedRecords: function (component, event, helper) {
        helper.submitSelectedRecords(component, event, helper);
        component.set('v.isSending',false);
    },
    
})