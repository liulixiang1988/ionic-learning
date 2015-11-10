<%@ page language="java" import="java.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>

<%
String strdepcode=aa.getReqParameterValue("depcode");
String keywords=aa.getReqParameterValue("keywords");
String wsurl=(String)session.getAttribute("wsurl");
%>

<aa:http id="oadepusers" keepreqdata="false" method="post" url="<%=wsurl%>">

<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
<aa:header name="SOAPAction" value="\"http://www.tlys/GetOAUserList\""/>

<aa:content>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tlys="http://www.tlys/">
   <soapenv:Header/>
   <soapenv:Body>
      <tlys:GetOAUserList>    
      <tlys:strdepcode><%=strdepcode %></tlys:strdepcode>
      <tlys:keywords><%=keywords %></tlys:keywords>     
      </tlys:GetOAUserList>
   </soapenv:Body>
</soapenv:Envelope>
</aa:content>
</aa:http>
<%
String strxml = aa.regex(".*","oadepusers").replaceAll("xmlns=\"http://www.tlys/\"", "");
//System.out.println(strxml);
%>
<aa:datasource id="oadepusersxml" wellformed="true" value="<%=strxml %>"></aa:datasource>

<%=aa.xpath("//GetOAUserListResult","oadepusersxml")%>