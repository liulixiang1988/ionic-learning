<%@ page language="java" import="java.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<%
//获取参数
//String businessId=aa.getReqParameterValue("businessid");
//String flowId=aa.getReqParameterValue("flowid");
//String nodeId=aa.getReqParameterValue("nodeid");
//String bFlowOrderId=aa.getReqParameterValue("bfloworderid");
String messageid=aa.getReqParameterValue("messageid");
//String userid=aa.getReqParameterValue("userid");
String wsurl="http://tgitbpm.tlys/WorkFlowApi.asmx";
%>
<aa:http id="tgitbpm" keepreqdata="false" method="post" url="<%=wsurl %>">
<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
<aa:header name="SOAPAction" value="\"http://tgitbpm.tlys/GetProcessJson\""/>

<aa:content>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tgit="http://tgitbpm.tlys/">
   <soapenv:Header/>
   <soapenv:Body>
      <tgit:GetProcessJson>
         <tgit:messageId><%=messageid %></tgit:messageId>         
      </tgit:GetProcessJson>
   </soapenv:Body>
</soapenv:Envelope>
</aa:content>
</aa:http>
<%
String strxml = aa.regex(".*","tgitbpm").replaceAll("xmlns=\"http://tgitbpm.tlys/\"", "");
System.out.println(strxml);
%>
<aa:datasource id="tgitbpmxml" wellformed="true" value="<%=strxml %>"></aa:datasource>
<%=aa.xpath("//GetProcessJsonResult","tgitbpmxml") %>