<%@ page language="java" import="java.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<%
String classid=aa.getReqParameterValue("classid");
%>


<aa:http id="oamrhq" keepreqdata="false" method="post" url="http://www.tlys/MobileOA.asmx">
<aa:header name="Host" value="172.16.8.15"/>
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
String strxml = aa.regex(".*","oamrhq").replaceAll("xmlns=\"http://www.tlys/\"", "");
//System.out.println(strxml);
//strxml=strxml.replace("&amp;lt;", "<");
//strxml=strxml.replace("&amp;gt;", ">");
//strxml=strxml.replace("&lt;", "<");
//strxml=strxml.replace("&gt;", ">");
//strxml=strxml.replace("&amp;quot;", "");


%>
<aa:datasource id="oamrhqxml" wellformed="true" value="<%=strxml %>"></aa:datasource>

<%
strxml=aa.xpath("//GetMrhqAndYzgzResult","oamrhqxml");
%>
<%=strxml%>

