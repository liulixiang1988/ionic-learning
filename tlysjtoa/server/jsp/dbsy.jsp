<%@ page language="java" import="java.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<%
String wsurl=(String)session.getAttribute("wsurl");
%>


<aa:http id="oatask" keepreqdata="false" method="post" url="<%=wsurl %>">
<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
<aa:header name="SOAPAction" value="\"http://www.tlys/GetPersonalTaskList\""/>

<aa:content>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tlys="http://www.tlys/">
   <soapenv:Header/>
   <soapenv:Body>
      <tlys:GetPersonalTaskList>         
      </tlys:GetPersonalTaskList>
   </soapenv:Body>
</soapenv:Envelope>
</aa:content>
</aa:http>
<%
String strxml = aa.regex(".*","oatask").replaceAll("xmlns=\"http://www.tlys/\"", "");
//System.out.println(strxml);
%>
<aa:datasource id="oataskxml" wellformed="true" value="<%=strxml %>"></aa:datasource>
<%=aa.xpath("//GetPersonalTaskListResult","oataskxml") %>