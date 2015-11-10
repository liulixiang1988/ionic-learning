<%@ page language="java" import="java.util.*"
 contentType="application/uixml+xml; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ include file="/client/adapt.jsp"%>
<%
//获取参数
String businessId=aa.getReqParameterValue("businessId");
String flowId=aa.getReqParameterValue("flowId");
String nodeId=aa.getReqParameterValue("nodeId");
String bFlowOrderId=aa.getReqParameterValue("bFlowOrderId");
String wsurl="http://172.16.8.23:8008/WorkFlowApi.asmx";
%>
<aa:http id="tgitbpm" keepreqdata="false" method="post" url="<%=wsurl %>">
<aa:header name="Content-Type" value="text/xml;charset=UTF-8"/>
<aa:header name="SOAPAction" value="\"http://tgitbpm.tlys/LoadData\""/>

<aa:content>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tgit="http://tgitbpm.tlys/">
   <soapenv:Header/>
   <soapenv:Body>
      <tgit:LoadData>
         <tgit:businessId><%=businessId %></tgit:businessId>
         <tgit:flowId><%=flowId %></tgit:flowId>
         <tgit:nodeId><%=nodeId %></tgit:nodeId>
         <tgit:bFlowOrderId><%=bFlowOrderId %></tgit:bFlowOrderId>
      </tgit:LoadData>
   </soapenv:Body>
</soapenv:Envelope>
</aa:content>
</aa:http>
<%
String strxml = aa.regex(".*","tgitbpm").replaceAll("xmlns=\"http://tgitbpm.tlys/\"", "");
System.out.println(strxml);
%>
<aa:datasource id="tgitbpmxml" wellformed="true" value="<%=strxml %>"></aa:datasource>
<%=aa.xpath("//LoadDataResult","tgitbpmxml") %>