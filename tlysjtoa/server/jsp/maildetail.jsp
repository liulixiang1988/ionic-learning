<%@ page language="java" import="java.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<%
String mailid=aa.getReqParameterValue("mailid");
String dttype="2";
String wsurl=(String)session.getAttribute("wsurl");
%>


<aa:http id="oagzlxdt" keepreqdata="false" method="post" url="<%=wsurl %>">

<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
<aa:header name="SOAPAction" value="\"http://www.tlys/ReadWorkkeepContent\""/>

<aa:content>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tlys="http://www.tlys/">
   <soapenv:Header/>
   <soapenv:Body>
      <tlys:ReadWorkkeepContent>
         <tlys:intmailid><%=mailid %></tlys:intmailid>         
         <tlys:datatype><%=dttype %></tlys:datatype>
      </tlys:ReadWorkkeepContent>
   </soapenv:Body>
</soapenv:Envelope>
</aa:content>
</aa:http>
<%
String strxml = aa.regex(".*","oagzlxdt").replaceAll("xmlns=\"http://www.tlys/\"", "");
//System.out.println(strxml);
%>
<aa:datasource id="oagzlxdtxml" wellformed="true" value="<%=strxml %>"></aa:datasource>
<%
strxml=aa.xpath("//ReadWorkkeepContentResult","oagzlxdtxml"); 
strxml=strxml.replace("&lt;", "<");
strxml=strxml.replace("&gt;", ">");
strxml=strxml.replace("nbsp;", "");
strxml=strxml.replace("&amp;", "");
strxml=strxml.replace("\r\n", "<br/>");
%>
<%=strxml %>