#new_feature/_admin_settings_project
## Context 


 **Purpose**: Since we introduced the table view for the project screen now , it is possible to let the users to add the column that they wanted to and store information they want to store 

### 1. Problem Statement 
- As a sales rep, I need the ability to customize my data views in Sparrow Genie just as I do in my CRM, so that I can track the specific metrics that matter to my deals. Because I cannot currently add custom columns, I am forced to leave Sparrow Genie and perform my work directly in the CRM, which prevents Sparrow Genie from becoming my primary daily workspace

### Scope 

-  Ability to create Field 
- Ability to create with Field  with multiple data types 
	- Single Line text 
	- Email
	- Multi line text 
	- Dropdown 
		- They can add the options as one by one or as bulk 
	- Number new 
	- Date 
	- Url 
- Ability to make it **mandatory** - which indeed will add the question in the project creation form 
- Ability to edit the field name once created
- Ability to disable the field if don't needed without deleting it 

###  Experience

#### Primary User Flow: 

 **New Field** -> **Select Data type** -> **Type the Label and Internal Name**-> **Create Field** -> Result : **New Field Created**

 #### Key Interactions: 
 
- [ ] **Make this mandatory while creating the project**

 > If the user Checks the this box it will add the question in the project creation form 
 
 #### Delete Field 
 - While deleting the project Field user should know the importance of the field , by letting the user know in how many projects that this particular field has been used 
 - The user has to very mindful when deleting a field, they have type **Delete** to Delete a field from the project fields 
 