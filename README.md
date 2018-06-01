# Crowdsourcing Marketplace using MySQL
To demonstrate the use of stateless RESTful web services by creating prototype of Freelancer web application. (www.freelancer.com).
```
Individual assignment for CMPE 273 - Enterprise Distributed Systems course during Software Engineering.
```
<br/>
## Goal

* The goal is to build a distributed enterprise web application which enables the user not only to upload , star/unstar or delete files/folders but also share files/folders to other users, create groups, add/edit/delete members and view their own activity timeline.
<br/>
## Features
* Sign Up, Sign In and Logout functionalities.
* Post Project and get bids from other users.
* Hire freelancer on the basis of bids received.
* Check open projects and bid on projects posted by other users.
* Check project completion date when freelancer is hired.
* Create and edit profile information.

<br/>

## System Design
> Applications uses a simple Client-Server architecture

* Client Side : ReactJS (HTML5 and Bootstrap)
```
Consists of total 20 React components. Effective modularisation is used in each component so as to increase reusability.
```

* Server Side : NodeJS, ExpressJS

```
Consists of 18 APIs to serve client requests.
```
<br/>

### Technology stack

![tech-stack](http://adsvento.in/images/react/mernstack.png)

<table>
<thead>
<tr>
<th>Area</th>
<th>Technology</th>
</tr>
</thead>
<tbody>
	<tr>
		<td>Front-End</td>
		<td>React, Redux, React Router, Bootstrap, HTML5, CSS3, Javascript ( ES6 )</td>
	</tr>
	<tr>
		<td>Back-End</td>
		<td>Express, Node.js</td>
	</tr>
	<tr>
		<td>API Testing</td>
		<td>Mocha, Postman</td>
	</tr>
	<tr>
		<td>Database</td>
		<td>MySQL</td>
	</tr>
	<tr>
		<td>Performance Testing</td>
		<td>JMeter</td>
	</tr>
  	<tr>
		<td>NPM Modules</td>
		<td>BCrypt, Multiparty, Axios</td>
	</tr>
</tbody>
</table>
<br/>


### Steps to run Springboot application:

* Create schema called dropbox
* import as maven project
* install all dependencies
* run the DropBoxApplication class

### Steps to run React side:

* run <code>npm install</code>
* run <code>npm start</code>
