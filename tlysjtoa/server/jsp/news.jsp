<%@ page language="java" import="java.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<%
String classid=aa.getReqParameterValue("classid");
String topnum=aa.getReqParameterValue("topnum");
String dttype="2";
String wsurl=(String)session.getAttribute("wsurl");
%>


<aa:http id="oanews" keepreqdata="false" method="post" url="<%=wsurl %>">
<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
<aa:header name="SOAPAction" value="\"http://www.tlys/GetNewsList\""/>

<aa:content>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tlys="http://www.tlys/">
   <soapenv:Header/>
   <soapenv:Body>
      <tlys:GetNewsList>
         <tlys:intClassId><%=classid %></tlys:intClassId>
         <tlys:intTopCount><%=topnum %></tlys:intTopCount>
         <tlys:datatype><%=dttype %></tlys:datatype>
      </tlys:GetNewsList>
   </soapenv:Body>
</soapenv:Envelope>
</aa:content>
</aa:http>
<%
String strxml = aa.regex(".*","oanews").replaceAll("xmlns=\"http://www.tlys/\"", "");
System.out.println(strxml);
%>
<aa:datasource id="oanewsxml" wellformed="true" value="<%=strxml %>"></aa:datasource>
<%=aa.xpath("//GetNewsListResult","oanewsxml") %>