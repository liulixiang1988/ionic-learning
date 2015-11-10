<%@ page language="java" import="java.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<%
String inData=aa.getReqParameterValue("inData");
String wsurl=(String)session.getAttribute("wsurl");
%>
<aa:http id="tgitdooa" keepreqdata="false" method="post" url="<%=wsurl %>">
<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
<aa:header name="SOAPAction" value="\"http://www.tlys/DoSubmit\""/>

<aa:content>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tlys="http://www.tlys/">
   <soapenv:Header/>
   <soapenv:Body>
      <tlys:DoSubmit>        
         <tlys:inData><%=inData %></tlys:inData>        
      </tlys:DoSubmit>
   </soapenv:Body>
</soapenv:Envelope>
</aa:content>
</aa:http>
<%
String strxml = aa.regex(".*","tgitdooa").replaceAll("xmlns=\"http://www.tlys/\"", "");
//System.out.println(strxml);
%>
<aa:datasource id="tgitdooaxml" wellformed="true" value="<%=strxml %>"></aa:datasource>
<%=aa.xpath("//DoSubmitResult","tgitdooaxml") %>