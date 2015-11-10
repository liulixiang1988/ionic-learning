<%@ page language="java" import="java.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<%
String receiveUserUid=aa.getReqParameterValue("receiveUserUid");
String receiveUserName=aa.getReqParameterValue("receiveUserName");
String MailSubject=aa.getReqParameterValue("MailSubject");
String MailContent=aa.getReqParameterValue("MailContent");
%>


<aa:http id="sendmail" keepreqdata="false" method="post" url="http://www.tlys/MobileOA.asmx">
<aa:header name="Host" value="172.16.8.15"/>
<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
<aa:header name="SOAPAction" value="\"http://www.tlys/SendMail\""/>

<aa:content>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tlys="http://www.tlys/">
   <soapenv:Header/>
   <soapenv:Body>
      <tlys:SendMail>
         <tlys:receiveUserUid><%=receiveUserUid %></tlys:receiveUserUid>
         <tlys:receiveUserName><%=receiveUserName %></tlys:receiveUserName>
         <tlys:MailSubject><%=MailSubject %></tlys:MailSubject>
         <tlys:MailContent><%=MailContent %></tlys:MailContent>
      </tlys:SendMail>
   </soapenv:Body>
</soapenv:Envelope>
</aa:content>
</aa:http>
<%
String strxml = aa.regex(".*","sendmail").replaceAll("xmlns=\"http://www.tlys/\"", "");
//System.out.println(strxml);
%>
<aa:datasource id="sendmailxml" wellformed="true" value="<%=strxml %>"></aa:datasource>
<%=aa.xpath("//SendMailResult","sendmailxml") %>