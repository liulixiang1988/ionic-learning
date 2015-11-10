<%@ page language="java" import="java.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<%
String businessid=aa.getReqParameterValue("businessid");
String bforderid=aa.getReqParameterValue("bforderid");
String entitycode=aa.getReqParameterValue("entitycode");
String wsurl=(String)session.getAttribute("wsurl");
%>
<aa:http id="gwtask" keepreqdata="false" method="post" url="<%=wsurl%>">

<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
<aa:header name="SOAPAction" value="\"http://www.tlys/GetGwAndAttach\""/>
<aa:content>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tlys="http://www.tlys/">
   <soapenv:Header/>
   <soapenv:Body>
      <tlys:GetGwAndAttach>
         <tlys:businessid><%=businessid%></tlys:businessid>
         <tlys:bforderid><%=bforderid%></tlys:bforderid>
         <tlys:entitycode><%=entitycode%></tlys:entitycode>
      </tlys:GetGwAndAttach>
   </soapenv:Body>
</soapenv:Envelope>
</aa:content>
</aa:http>
<%
String strxml = aa.regex(".*","gwtask").replaceAll("xmlns=\"http://www.tlys/\"", "");
//System.out.println(strxml);
%>
<aa:datasource id="gwtaskxml" wellformed="true" value="<%=strxml %>"></aa:datasource>
<%=aa.xpath("//GetGwAndAttachResult","gwtaskxml")%>