<%@ page language="java" import="java.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<%
String inData=aa.getReqParameterValue("inData");
String wsurl=(String)session.getAttribute("wsurl");
%>
<aa:http id="tgitdooa2" keepreqdata="false" method="post" url="<%=wsurl %>">
<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
<aa:header name="SOAPAction" value="\"http://www.tlys/DoSubmit2\""/>

<aa:content>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tlys="http://www.tlys/">
   <soapenv:Header/>
   <soapenv:Body>
      <tlys:DoSubmit2>        
         <tlys:inData><%=inData %></tlys:inData>        
      </tlys:DoSubmit2>
   </soapenv:Body>
</soapenv:Envelope>
</aa:content>
</aa:http>
<%
String strxml = aa.regex(".*","tgitdooa2").replaceAll("xmlns=\"http://www.tlys/\"", "");
//System.out.println(strxml);
%>
<aa:datasource id="tgitdooa2xml" wellformed="true" value="<%=strxml %>"></aa:datasource>
<%=aa.xpath("//DoSubmit2Result","tgitdooa2xml") %>