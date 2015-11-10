<%@ page language="java" import="java.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<aa:http id="oabgt" keepreqdata="false" method="post" url="http://www.tlys/MobileOA.asmx">
<aa:header name="Host" value="172.16.8.15"/>
<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
<aa:header name="SOAPAction" value="\"http://www.tlys/GetBgtList\""/>

<aa:content>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tlys="http://www.tlys/">
   <soapenv:Header/>
   <soapenv:Body>
      <tlys:GetBgtList>         
      </tlys:GetBgtList>
   </soapenv:Body>
</soapenv:Envelope>
</aa:content>
</aa:http>
<%
String strxml = aa.regex(".*","oabgt").replaceAll("xmlns=\"http://www.tlys/\"", "");
%>

<aa:datasource id="oabgtxml" wellformed="true" value="<%=strxml %>"></aa:datasource>
<%
strxml=aa.xpath("//GetBgtListResult","oabgtxml");
%>
<%=strxml%>