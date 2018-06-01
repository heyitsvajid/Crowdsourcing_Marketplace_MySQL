# Crowdsourcing Marketplace using MySQL
To demonstrate the use of stateless RESTful web services by creating prototype of Freelancer web application. (www.freelancer.com).

```
Individual assignment for CMPE 273 - Enterprise Distributed Systems course during Software Engineering.
```

## Goal

* The goal is to build a distributed enterprise web application which enables the user not only to upload , star/unstar or delete files/folders but also share files/folders to other users, create groups, add/edit/delete members and view their own activity timeline.

## Features
* Sign Up, Sign In and Logout functionalities.
* Post Project and get bids from other users.
* Hire freelancer on the basis of bids received.
* Check open projects and bid on projects posted by other users.
* Check project completion date when freelancer is hired.
* Create and edit profile information.

> For Detailed Description check [Project Report](https://atom.io/)


## System Design
> Applications uses a simple Client-Server architecture

* Client Side : ReactJS (HTML5 and Bootstrap)
```
Consists of total 20 React components. 
Effective modularisation is used in each component so as to increase reusability.
```

* Server Side : NodeJS, ExpressJS

```
Consists of 18 APIs to serve client requests.
```

## System Architecture
![Architecture](/Architecture.png)


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


### Steps to run application:

* Create database schema 
* Go to path : …\Lab1-Freelancer\freelancer
* npm install
* npm run start-dev 
> This will start ReactJS server on 3000 port and NodeJS server will start at 3001 port.
