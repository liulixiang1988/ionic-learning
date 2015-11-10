<%@ page language="java" import="java.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<%
String wsurl=(String)session.getAttribute("wsurl");
%>

<aa:http id="oagw" keepreqdata="false" method="post" url="<%=wsurl %>">

<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
<aa:header name="SOAPAction" value="\"http://www.tlys/GetPersonGwList\""/>

<aa:content>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tlys="http://www.tlys/">
   <soapenv:Header/>
   <soapenv:Body>
      <tlys:GetPersonGwList></tlys:GetPersonGwList>
   </soapenv:Body>
</soapenv:Envelope>
</aa:content>
</aa:http>
<%
String strxml = aa.regex(".*","oagw").replaceAll("xmlns=\"http://www.tlys/\"", "");
//System.out.println(strxml);
%>
<aa:datasource id="oagwxml" wellformed="true" value="<%=strxml %>"></aa:datasource>
<%
strxml=aa.xpath("//GetPersonGwListResult","oagwxml") ;
strxml=strxml.replace("&lt;", "<");
strxml=strxml.replace("&gt;", ">");
%>
<%=strxml%>