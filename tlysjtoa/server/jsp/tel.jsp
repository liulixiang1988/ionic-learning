<%@ page language="java" import="java.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<%
String keywords=aa.getReqParameterValue("keywords");
%>

<aa:http id="oatel" keepreqdata="false" method="post" url="http://172.16.223.180:8888/MobileOA.asmx">
<aa:header name="Host" value="172.16.223.180"/>
<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
<aa:header name="SOAPAction" value="\"http://www.tlys/GetSearchTel\""/>

<aa:content>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tlys="http://www.tlys/">
   <soapenv:Header/>
   <soapenv:Body>
      <tlys:GetSearchTel>    
           <tlys:keywords><%=keywords %></tlys:keywords>     
      </tlys:GetSearchTel>
   </soapenv:Body>
</soapenv:Envelope>
</aa:content>
</aa:http>
<%
String strxml = aa.regex(".*","oatel").replaceAll("xmlns=\"http://www.tlys/\"", "");
//System.out.println(strxml);
%>
<aa:datasource id="oatelxml" wellformed="true" value="<%=strxml %>"></aa:datasource>

<%=aa.xpath("//GetSearchTelResult","oatelxml")%>