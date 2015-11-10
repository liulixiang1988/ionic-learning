<%@ page language="java" import="java.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<%
String mailbox=aa.getReqParameterValue("mailbox");
String dttype=aa.getReqParameterValue("datatype");
String keywords="";
String wsurl=(String)session.getAttribute("wsurl");
%>


<aa:http id="oagzlx" keepreqdata="false" method="post" url="<%=wsurl%>">

<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
<aa:header name="SOAPAction" value="\"http://www.tlys/GetWorkkeepList\""/>

<aa:content>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tlys="http://www.tlys/">
   <soapenv:Header/>
   <soapenv:Body>
      <tlys:GetWorkkeepList>
         <tlys:mailbox><%=mailbox %></tlys:mailbox>
         <tlys:keywords><%=keywords %></tlys:keywords>
         <tlys:datatype><%=dttype %></tlys:datatype>
      </tlys:GetWorkkeepList>
   </soapenv:Body>
</soapenv:Envelope>
</aa:content>
</aa:http>
<%
String strxml = aa.regex(".*","oagzlx").replaceAll("xmlns=\"http://www.tlys/\"", "");
//System.out.println(strxml);
%>
<aa:datasource id="oagzlxxml" wellformed="true" value="<%=strxml %>"></aa:datasource>
<%=aa.xpath("//GetWorkkeepListResult","oagzlxxml") %>