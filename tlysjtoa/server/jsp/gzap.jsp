<%@ page language="java" import="java.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<%
String classid=aa.getReqParameterValue("classid");
%>


<aa:http id="oagzap" keepreqdata="false" method="post" url="http://www.tlys/MobileOA.asmx">

<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
<aa:header name="SOAPAction" value="\"http://www.tlys/GetMrhqAndYzgz\""/>

<aa:content>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tlys="http://www.tlys/">
   <soapenv:Header/>
   <soapenv:Body>
      <tlys:GetMrhqAndYzgz>
         <tlys:classid><%=classid %></tlys:classid>
      </tlys:GetMrhqAndYzgz>
   </soapenv:Body>
</soapenv:Envelope>
</aa:content>
</aa:http>
<%
String strxml = aa.regex(".*","oagzap").replaceAll("xmlns=\"http://www.tlys/\"", "");
//System.out.println(strxml);
%>
<aa:datasource id="oagzapxml" wellformed="true" value="<%=strxml %>"></aa:datasource>

<%=aa.xpath("//GetMrhqAndYzgzResult","oagzapxml")%>
