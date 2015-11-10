<%@ page language="java" import="java.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<%
String depcode=aa.getReqParameterValue("depcode");
%>


<aa:http id="oabgtxq" keepreqdata="false" method="post" url="http://www.tlys/MobileOA.asmx">
<aa:header name="Host" value="172.16.8.15"/>
<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
<aa:header name="SOAPAction" value="\"http://www.tlys/GetBgtInfoList\""/>

<aa:content>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tlys="http://www.tlys/">
   <soapenv:Header/>
   <soapenv:Body>
      <tlys:GetBgtInfoList>
         <tlys:strdepcode><%=depcode %></tlys:strdepcode>         
      </tlys:GetBgtInfoList>
   </soapenv:Body>
</soapenv:Envelope>
</aa:content>
</aa:http>
<%
String strxml = aa.regex(".*","oabgtxq").replaceAll("xmlns=\"http://www.tlys/\"", "");
//System.out.println(strxml);
%>
<aa:datasource id="oabgtxqxml" wellformed="true" value="<%=strxml %>"></aa:datasource>
<%=aa.xpath("//GetBgtInfoListResult","oabgtxqxml") %>