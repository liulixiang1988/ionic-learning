<%@ page language="java" import="java.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<%
String mailid=aa.getReqParameterValue("mailid");
String wsurl=(String)session.getAttribute("wsurl");
%>


<aa:http id="oagzlxdel" keepreqdata="false" method="post" url="<%=wsurl %>">

<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
<aa:header name="SOAPAction" value="\"http://www.tlys/DelMail\""/>

<aa:content>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tlys="http://www.tlys/">
   <soapenv:Header/>
   <soapenv:Body>
      <tlys:DelMail>
         <tlys:mailid><%=mailid %></tlys:mailid>  
      </tlys:DelMail>
   </soapenv:Body>
</soapenv:Envelope>
</aa:content>
</aa:http>
<%
String strxml = aa.regex(".*","oagzlxdel").replaceAll("xmlns=\"http://www.tlys/\"", "");
//System.out.println(strxml);
%>
<aa:datasource id="oagzlxdelxml" wellformed="true" value="<%=strxml %>"></aa:datasource>
<%
strxml=aa.xpath("//DelMailResult","oagzlxdelxml"); 
strxml=strxml.replace("&lt;", "<");
strxml=strxml.replace("&gt;", ">");
strxml=strxml.replace("nbsp;", "");
strxml=strxml.replace("&amp;", "");
strxml=strxml.replace("\r\n", "<br/>");
%>
<%=strxml %>